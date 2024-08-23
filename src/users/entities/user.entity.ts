import { Order } from "src/orders/entities/order.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
