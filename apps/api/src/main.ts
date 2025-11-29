import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "./app.module";
import { auth } from "./lib/auth";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
    cors: {
      origin: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
      credentials: true,
    },
  });

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("WeFinance API")
    .setDescription(
      "Documentação da API para o sistema de finanças pessoais e familiares"
    )
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "jwt"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const authSchema = await auth.api.generateOpenAPISchema();

  app.use(
    "/docs",
    apiReference({
      sources: [
        { title: "WeFinance API", content: document },
        {
          title: "Better Auth",
          content: authSchema,
        },
      ],
      theme: "default",
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
