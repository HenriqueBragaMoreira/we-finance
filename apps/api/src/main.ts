import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
    cors: {
      origin: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
      credentials: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle("WeFinance API")
    .setDescription(
      "Documentação da API para o sistema de finanças pessoais e familiares"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
