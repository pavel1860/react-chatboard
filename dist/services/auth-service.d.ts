export interface User {
    id: string;
    is_guest: boolean;
    guest_token?: string;
    auth_user_id?: string;
    email?: string;
    created_at: string;
    nickname?: string;
}
export declare function createGuestUser(data?: Partial<User>): Promise<User>;
export declare function registerUser(auth_user_id: string, data: any): Promise<User>;
export declare function promoteGuestUser(guest_token: string, auth_user_id: string, data?: any): Promise<User>;
export declare function fetchCurrentUser(options: {
    guestToken?: string;
    authUserId?: string;
    errorOn401?: boolean;
}): Promise<User | null>;
//# sourceMappingURL=auth-service.d.ts.map