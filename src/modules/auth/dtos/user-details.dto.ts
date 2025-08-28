export class UserDetailsDto {
  id: number;
  kind: number;
  authorities: string[];
  isSuperAdmin: boolean;

  constructor(
    id: number,
    kind: number,
    authorities: string[],
    isSuperAdmin: boolean,
  ) {
    this.id = id;
    this.kind = kind;
    this.authorities = authorities;
    this.isSuperAdmin = isSuperAdmin;
  }
}
