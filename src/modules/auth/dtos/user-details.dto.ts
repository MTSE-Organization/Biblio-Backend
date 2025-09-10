export class UserDetailsDto {
  id: bigint;
  kind: number;
  authorities: string[];
  isSuperAdmin: boolean;

  constructor(
    id: bigint,
    kind: number,
    authorities: string[],
    isSuperAdmin: boolean
  ) {
    this.id = id;
    this.kind = kind;
    this.authorities = authorities;
    this.isSuperAdmin = isSuperAdmin;
  }
}
