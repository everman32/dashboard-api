export interface IEnvService {
  getString: (key: string) => string;
  getNumber: (key: string) => number;
}
