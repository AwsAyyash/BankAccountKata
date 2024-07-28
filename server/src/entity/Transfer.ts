import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class Transfer {
    @PrimaryGeneratedColumn()
    transfer_id!: number;

    @Column({ type: "varchar", length: 255 })
    recipient_iban!: string;

    @OneToOne(() => Transaction)
    @JoinColumn()
    transaction!: Transaction;
}
