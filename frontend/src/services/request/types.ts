export type Options = {
  [key: string]: string | number | object | undefined,
  headers?: {
    'Content-Type'?: string,
    Authorization?: string,
  },
  params?: Record<string, unknown>
}

export type MergedOptionsType = {
  next: {
    revalidate: number
  },
  headers: {
    'Content-Type': string,
    Authorization?: string | undefined,
  }
  body?: string,
  method: Method
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
