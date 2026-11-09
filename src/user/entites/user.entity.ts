import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column({ unique: true })
    useremail:string;

    @Column()
    password:string;
}