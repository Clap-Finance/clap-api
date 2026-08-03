export declare enum Role {
    USER = "USER",
    AGENT = "AGENT",
    SUPPORT = "SUPPORT",
    COMPLIANCE = "COMPLIANCE",
    FINANCE = "FINANCE",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export declare class ChangeRoleDto {
    role: Role;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
