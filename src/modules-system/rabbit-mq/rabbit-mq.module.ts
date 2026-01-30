// module cấu hình rabbitmq cho microservice
import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { RABBIT_MQ_URL } from "../../common/constant/app.constant";

// global để module này dùng được ở mọi nơi
@Global()
@Module({
  imports: [
    // đăng ký client rabbitmq cho order service
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBIT_MQ_URL!],
          queue: 'order_queue',
          queueOptions: {
            durable: false // false: restart rabbitmq thì queue bị xóa
          },
          socketOptions: {
            connectionOptions: {
              clientProperties: {
                connection_name: 'order-send',
              },
            },
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule implements OnModuleInit {
  // inject client rabbitmq
  constructor(@Inject('ORDER_SERVICE') private client: ClientProxy) {}

  // kết nối rabbitmq khi khởi tạo module
  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }
}