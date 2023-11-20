import { ConstAdminID, ConstCertID, ConstEventID, ConstGroupID, ConstHomeID, ConstOcupptID, ConstSignID, ConstSponID, ConstStructID, ConstTemplaID, ConstUserID } from "./components-id";
export const MENU_ITEMS: any[] = [
  {
    "title": "Tablero Administrativo",
    "icon": "book-outline",
    "link": "home"
  },
  {
    "title": "Estaciones",
    "icon": "smartphone-outline",
    "link": "view/device"
  },
  {
    "title": "Demografia",
    "icon": "globe-2-outline",
    "link": "view/demography"
  },
  {
    "title": "Usuarios",
    "icon": "people-outline",
    "children": [
      {
        "title": "Clientes",
        "icon": "person",
        "link": "view/client"
      },
      {
        "title": "Personas",
        "icon": "person-outline",
        "link": "view/person"
      },     
      {
        "title": "Operadores",
        "icon": "shield-outline",
        "link": "view/user"
      }
    ]
  },
  
];

export const OPTION_ITEMS: any[] = [
  {
    "title": "Cerrar Sesión",
    "icon": "log-out",
    "link": "home"
  }

];

