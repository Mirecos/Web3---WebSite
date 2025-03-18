import { Permission } from "../types/Permissions"
import { PermissionLabel } from "./PermissionLabel"
import { RoleLabel } from "./RoleLabel"

// Define permissions for each roles
const roles_to_permissions = new Map<String, Permission[]>([])
roles_to_permissions.set(RoleLabel.MEMBER, [
    {label: PermissionLabel.EDIT_OWN_ACCOUNT},
    {label: PermissionLabel.DELETE_OWN_ACCOUNT}
])

// Retrieve permissions for a given role with the above hashmap
export function getPermissions(label: string) : Permission[]{
    const permissions = roles_to_permissions.get(label)
    if(permissions === undefined)return []
    return permissions
}