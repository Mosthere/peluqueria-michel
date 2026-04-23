import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll(search?: string) {
    if (search) {
      return this.clientRepository
        .createQueryBuilder('client')
        .where('client.name ILIKE :search OR client.phone ILIKE :search OR client.email ILIKE :search', {
          search: `%${search}%`,
        })
        .orderBy('client.name', 'ASC')
        .getMany();
    }
    return this.clientRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  create(dto: CreateClientDto) {
    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    return this.clientRepository.softRemove(client);
    }
    
    async restore(id: string) {
  await this.clientRepository.restore(id);
  return this.clientRepository.findOne({ 
    where: { id },
    withDeleted: true,
  });
}
}