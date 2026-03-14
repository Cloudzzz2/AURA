export interface INodeAttackState {
  canPivot: boolean;
  networkAccess: boolean;
  privilegeLevel: 'none' | 'user' | 'admin';
}
