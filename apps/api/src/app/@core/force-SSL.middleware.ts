import { Request, Response, NextFunction } from 'express';

export function forceSSLMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.ALLOW_LOCALHOST === 'true' && req.hostname === 'localhost') {
      return next();
    }

    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join(''),
      );
    }
    next();
  };
}
