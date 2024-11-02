-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "department_name" TEXT NOT NULL,
    "employeeId" TEXT,
    CONSTRAINT "departments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "salary_in_rs" INTEGER NOT NULL,
    "department_id" TEXT NOT NULL
);
