class ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;

  constructor(responseData: {
    data: T,
    message: string,
    statusCode: number
  }) {

    const { data, message, statusCode } = responseData

    if (typeof statusCode !== 'number') {
      throw new TypeError('statusCode must be a number');
    }

    this.data = data;
    this.success = statusCode < 400;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { ApiResponse };