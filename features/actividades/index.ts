import CazaLetras from "./cazaletras/CazaLetras";
import GeoSopa from "./geosopa/GeoSopa";
import PuntoGo from "./puntogo/PuntoGo";
import DiloTu from "./dilo-tu/DiloTu";

export type ActividadId =
  | "cazaletras" | "geosopa" | "puntogo" | "dilo-tu";

export const ACTIVIDADES: Record<ActividadId, {
  id: ActividadId;
  titulo: string;
  area: "Lengua" | "P. Matemático";
  componente: React.ComponentType<any>;
}> = {
  "cazaletras":  { id:"cazaletras",  titulo:"CazaLetras", area:"Lengua", componente: CazaLetras },
  "geosopa":     { id:"geosopa",     titulo:"GeoSopa",    area:"P. Matemático", componente: GeoSopa },
  "puntogo":     { id:"puntogo",     titulo:"PuntoGo",    area:"P. Matemático", componente: PuntoGo },
  "dilo-tu":     { id:"dilo-tu",     titulo:"¡DiloTú!",   area:"Lengua", componente: DiloTu },
};
