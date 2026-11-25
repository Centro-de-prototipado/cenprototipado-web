"""Genera apps/red/lib/manizales-geo.ts a partir de los límites de OpenStreetMap
(perímetro urbano, comunas y corregimientos de Manizales) descargados en geom.json."""
import json, math, sys

src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src, encoding="utf8"))

# Encuadre: ciudad y alrededores (incluye las aulas rurales de La Trinidad y María Goretti).
LON0, LON1 = -75.615, -75.435
LAT0 = 4.992
H_OBJ = 750.7  # mismo alto que el mapa de Caldas, para que el zoom no cambie de tamaño
LAT_MED = 5.058
KX = 111.320 * math.cos(math.radians(LAT_MED))  # km por grado de longitud
KY = 110.574  # km por grado de latitud
W = 1000.0
ANCHO_KM = (LON1 - LON0) * KX
PX_KM = W / ANCHO_KM
H = H_OBJ
LAT1 = LAT0 + H / (KY * PX_KM)


def proj(lat, lon):
    return ((lon - LON0) * KX * PX_KM, (LAT1 - lat) * KY * PX_KM)


def rings(rel):
    """Une las vías 'outer' de una relación en anillos cerrados."""
    segs = [[(p["lat"], p["lon"]) for p in m["geometry"]] for m in rel["members"] if m["type"] == "way" and m.get("role", "outer") in ("outer", "") and "geometry" in m]
    out = []
    while segs:
        ring = segs.pop(0)
        changed = True
        while ring[0] != ring[-1] and changed:
            changed = False
            for i, s in enumerate(segs):
                if s[0] == ring[-1]:
                    ring += s[1:]
                elif s[-1] == ring[-1]:
                    ring += s[::-1][1:]
                elif s[-1] == ring[0]:
                    ring = s[:-1] + ring
                elif s[0] == ring[0]:
                    ring = s[::-1][:-1] + ring
                else:
                    continue
                segs.pop(i)
                changed = True
                break
        if len(ring) > 3:
            out.append(ring)
    return out


def dp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy) or 1e-9
    imax, dmax = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        dd = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n
        if dd > dmax:
            imax, dmax = i, dd
    if dmax > eps:
        return dp(pts[: imax + 1], eps)[:-1] + dp(pts[imax:], eps)
    return [pts[0], pts[-1]]


def path(rs, eps=0.8):
    parts = []
    for r in rs:
        pts = [proj(a, b) for a, b in r]
        mitad = len(pts) // 2
        p = dp(pts[: mitad + 1], eps)[:-1] + dp(pts[mitad:], eps)
        if len(p) < 4:
            continue
        parts.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in p) + "Z")
    return "".join(parts)


def dentro(x, y, poly):
    c = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def dist_borde(x, y, poly):
    best = 1e9
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i - 1], poly[i]
        dx, dy = x2 - x1, y2 - y1
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy or 1e-9)))
        best = min(best, math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)))
    return best


def centro(rs):
    """Punto interior más alejado del borde, recortado al encuadre visible."""
    poly = max(([proj(a, b) for a, b in r] for r in rs), key=len)
    xs, ys = [p[0] for p in poly], [p[1] for p in poly]
    x0, x1 = max(min(xs), 30), min(max(xs), W - 30)
    y0, y1 = max(min(ys), 30), min(max(ys), H - 30)
    best, bp = -1, None
    for i in range(41):
        for j in range(41):
            x = x0 + (x1 - x0) * i / 40
            y = y0 + (y1 - y0) * j / 40
            if dentro(x, y, poly):
                dd = min(dist_borde(x, y, poly), x - 0, W - x, y - 0, H - y)
                if dd > best:
                    best, bp = dd, (x, y)
    return [round(bp[0], 1), round(bp[1], 1)] if bp else None


comunas, correg, perimetro = [], [], ""
for e in d["elements"]:
    nombre = e["tags"]["name"]
    rs = rings(e)
    if e["id"] == 406051:
        perimetro = path(rs, 0.5)
    elif e["tags"].get("admin_level") == "8":
        comunas.append({"nombre": nombre.replace("Comuna ", ""), "d": path(rs, 0.5), "centro": centro(rs)})
    else:
        correg.append({"nombre": nombre, "d": path(rs, 1.0), "centro": centro(rs)})

comunas.sort(key=lambda c: c["nombre"])
correg.sort(key=lambda c: c["nombre"])

with open(out, "w", encoding="utf8") as f:
    f.write("// Generado con los límites de OpenStreetMap (© colaboradores de OpenStreetMap, ODbL):\n")
    f.write("// perímetro urbano, 12 comunas y 7 corregimientos de Manizales. No editar a mano.\n\n")
    f.write(f"export const MANIZALES_VIEWBOX = {{ width: {W:.0f}, height: {H:.1f} }}\n")
    f.write(f"export const MANIZALES_PX_POR_KM = {PX_KM:.3f}\n\n")
    f.write("/** Convierte latitud y longitud a coordenadas del lienzo del mapa de Manizales. */\n")
    f.write("export function proyectarManizales(lat: number, lon: number): [number, number] {\n")
    f.write(f"  return [(lon - ({LON0})) * {KX * PX_KM:.4f}, ({LAT1} - lat) * {KY * PX_KM:.4f}]\n}}\n\n")
    f.write("export type ZonaManizales = { nombre: string; d: string; centro: [number, number] | null }\n\n")
    f.write(f"export const perimetroUrbano = {json.dumps(perimetro)}\n\n")
    f.write(f"export const comunasManizales: ZonaManizales[] = {json.dumps(comunas, ensure_ascii=False)}\n\n")
    f.write(f"export const corregimientosManizales: ZonaManizales[] = {json.dumps(correg, ensure_ascii=False)}\n")

print("W", W, "H", round(H, 1), "px/km", round(PX_KM, 2), "comunas", len(comunas), "corregimientos", len(correg), "bytes", sum(len(c["d"]) for c in comunas + correg) + len(perimetro))
