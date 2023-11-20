export interface Department {
    id: number,
    name: string,
    createdAt: string
};

export interface Province {
    id: number,
    iddepartment: number;
    department: string;
    name: string;
    createdAt: string
};

export interface Municipality {
    id: number,
    idprovince: number;
    province: string;
    name: string;
    createdAt: string
};

export interface Community {
    id: number,
    idmunicipality: number;
    municipality: string,
    name: string,
    createdAt: string
}

export interface Location {
    id: number,
    idcommunity: number;
    community: string,
    name: string,
    createdAt: string
}