import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    location: string;
    designation: string;
    gender: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.employee.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: Role[data.role],
        location: data.location,
        designation: data.designation,
        gender: Gender[data.gender],
      },
    });
  }

  async login(data: { email: string; password: string }) {
    const employee = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (
      !employee ||
      !(await bcrypt.compare(data.password, employee.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { employeeId: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return { token, role: employee.role };
  }
}
