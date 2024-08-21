import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('leaves')
export class Leave {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    pathname: string;

    @ManyToOne(() => Role, (role) => role.leaves)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ name: 'can_read' })
    canRead: boolean;

    @Column({ name: 'can_create' })
    canCreate: boolean;

    @Column({ name: 'can_update' })
    canUpdate: boolean;

    @Column({ name: 'can_delete' })
    canDelete: boolean;
}