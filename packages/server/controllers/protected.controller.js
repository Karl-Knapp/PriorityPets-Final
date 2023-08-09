export function getTest(req, res, next) {
  try {
    res.send("The user is authenticated");
  } catch (error) {
    next(error);
  }
}
