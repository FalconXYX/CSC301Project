const { Prisma } = require("@prisma/client");

function mapPrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return { status: 409, message: "Unique constraint failed" };
      case "P2003":
        return { status: 400, message: "Invalid reference" };
      case "P2000":
        return { status: 400, message: "Value is too long" };
      case "P2001":
      case "P2025":
        return { status: 404, message: "Record not found" };
      case "P2004":
        return { status: 400, message: "Constraint failed" };
      default:
        return { status: 400, message: "Database request error" };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, message: "Invalid request data" };
  }

  return null;
}

module.exports = mapPrismaError;
