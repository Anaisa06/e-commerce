import { Leave } from "src/leaves/entities/leave.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => Leave, (leave) => leave.role)
    leaves: Leave[];

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
