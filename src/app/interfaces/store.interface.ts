export interface Store {
    storeID:   string;
    storeName: string;
    isActive:  number;
    images:    Images;
}

export interface Images {
    banner: string;
    logo:   string;
    icon:   string;
}
