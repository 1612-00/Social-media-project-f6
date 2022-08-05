export interface RegisterResponseDto {
  user: object;
  accessToken: string;
  accessTokenExpire?: number | string;
}
