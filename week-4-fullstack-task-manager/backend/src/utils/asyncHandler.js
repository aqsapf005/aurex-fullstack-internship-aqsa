// Express 4 does not catch errors thrown inside async functions, so we forward them to next()
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
export default asyncHandler
