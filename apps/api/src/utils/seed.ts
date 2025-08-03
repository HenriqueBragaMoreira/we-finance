import { auth } from "@/lib/auth";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    console.info("⏳ Running seed...");
    const start = Date.now();

    console.info("🧹 Cleaning existing data...");

    await prisma.installment.deleteMany();
    await prisma.income.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.investment.deleteMany();
    await prisma.category.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    console.info("✅ Existing data cleaned");

    console.info("📝 Creating admin users...");

    const authCtx = await auth.$context;
    const userPassword = "admin123!@#";

    const hash = await authCtx.password.hash(userPassword);
    const createdUser = await authCtx.internalAdapter.createUser({
      email: "henrique-braga@gmail.com",
      password: userPassword,
      name: "Henrique Braga",
      image: "https://github.com/henriquebragamoreira.png",
    });

    await authCtx.internalAdapter.linkAccount({
      userId: createdUser.id,
      providerId: "credential",
      accountId: createdUser.id,
      password: hash,
    });

    const secondUser = await authCtx.internalAdapter.createUser({
      email: "gislaine-santos@gmail.com",
      password: userPassword,
      name: "Gislaine Santos",
      image:
        "https://scontent-gru2-2.cdninstagram.com/v/t51.2885-19/450789839_1545162369682154_1725794894868512506_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44NTIuYzIifQ&_nc_ht=scontent-gru2-2.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2QE2t7NgfuizeNFhK1kqpVkkYTlSWcso0HhWd2oxBTZng1qFPJwA4FOkolBRdY-Ni8x_csAGLiM4rlh47qxiAuNM&_nc_ohc=lgWEYraHLTMQ7kNvwHMu5Sy&_nc_gid=XIIWXYjkiWOtTqbRBa7A1Q&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfT2rJAQYpjKX-eIGUBa_Fle2lVoEC-lJGqyvlq0gE2KCA&oe=688C8662&_nc_sid=7a9f4b",
    });

    const hash2 = await authCtx.password.hash(userPassword);
    await authCtx.internalAdapter.linkAccount({
      userId: secondUser.id,
      providerId: "credential",
      accountId: secondUser.id,
      password: hash2,
    });

    console.info("✅ Users created successfully");

    console.info("📂 Creating categories...");

    const incomeCategories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Salário",
          type: "INCOME",
        },
      }),
      prisma.category.create({
        data: {
          name: "Freelance",
          type: "INCOME",
        },
      }),
      prisma.category.create({
        data: {
          name: "Vendas",
          type: "INCOME",
        },
      }),
      prisma.category.create({
        data: {
          name: "Rendimentos",
          type: "INCOME",
        },
      }),
    ]);

    const expenseCategories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Alimentação",
          type: "EXPENSE",
        },
      }),
      prisma.category.create({
        data: {
          name: "Transporte",
          type: "EXPENSE",
        },
      }),
      prisma.category.create({
        data: {
          name: "Moradia",
          type: "EXPENSE",
        },
      }),
      prisma.category.create({
        data: {
          name: "Saúde",
          type: "EXPENSE",
        },
      }),
      prisma.category.create({
        data: {
          name: "Lazer",
          type: "EXPENSE",
        },
      }),
      prisma.category.create({
        data: {
          name: "Educação",
          type: "EXPENSE",
        },
      }),
    ]);

    const investmentCategories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Ações",
          type: "INVESTMENT",
        },
      }),
      prisma.category.create({
        data: {
          name: "Renda Fixa",
          type: "INVESTMENT",
        },
      }),
      prisma.category.create({
        data: {
          name: "Fundos Imobiliários",
          type: "INVESTMENT",
        },
      }),
      prisma.category.create({
        data: {
          name: "Criptomoedas",
          type: "INVESTMENT",
        },
      }),
    ]);

    console.info("✅ Categories created successfully");

    console.info("💳 Creating payment methods...");

    const paymentMethods = await Promise.all([
      prisma.paymentMethod.create({
        data: {
          name: "PIX",
        },
      }),
      prisma.paymentMethod.create({
        data: {
          name: "Cartão de Crédito",
        },
      }),
      prisma.paymentMethod.create({
        data: {
          name: "Cartão de Débito",
        },
      }),
      prisma.paymentMethod.create({
        data: {
          name: "Dinheiro",
        },
      }),
      prisma.paymentMethod.create({
        data: {
          name: "Transferência Bancária",
        },
      }),
      prisma.paymentMethod.create({
        data: {
          name: "Boleto",
        },
      }),
    ]);

    console.info("✅ Payment methods created successfully");

    const users = [createdUser, secondUser];

    console.info("💰 Creating incomes...");

    for (const user of users) {
      for (let i = 0; i < 15; i++) {
        await prisma.income.create({
          data: {
            name: faker.finance.transactionDescription(),
            amount: faker.number.float({
              min: 500,
              max: 8000,
              fractionDigits: 2,
            }),
            receivedAt: faker.date.between({
              from: new Date(2024, 0, 1),
              to: new Date(),
            }),
            paymentMethod: {
              connect: { id: faker.helpers.arrayElement(paymentMethods).id },
            },
            status: faker.helpers.arrayElement(["PENDING", "RECEIVED"]),
            user: { connect: { id: user.id } },
            category: {
              connect: { id: faker.helpers.arrayElement(incomeCategories).id },
            },
          },
        });
      }
    }

    console.info("✅ Incomes created successfully");

    console.info("💸 Creating expenses...");

    for (const user of users) {
      for (let i = 0; i < 20; i++) {
        const shouldHaveInstallments = faker.datatype.boolean(0.3);

        const expense = await prisma.expense.create({
          data: {
            name: faker.commerce.productName(),
            amount: faker.number.float({
              min: 50,
              max: 2000,
              fractionDigits: 2,
            }),
            spentAt: faker.date.between({
              from: new Date(2024, 0, 1),
              to: new Date(),
            }),
            paymentMethod: {
              connect: { id: faker.helpers.arrayElement(paymentMethods).id },
            },
            status: faker.helpers.arrayElement(["PENDING", "PAID"]),
            user: { connect: { id: user.id } },
            category: {
              connect: { id: faker.helpers.arrayElement(expenseCategories).id },
            },
          },
        });

        if (shouldHaveInstallments) {
          const installmentCount = faker.number.int({ min: 2, max: 12 });
          const installmentAmount = Number(expense.amount) / installmentCount;

          for (let j = 1; j <= installmentCount; j++) {
            await prisma.installment.create({
              data: {
                expenseId: expense.id,
                dueDate: faker.date.future({ years: 1 }),
                amount: installmentAmount,
                number: j,
                status: faker.helpers.arrayElement(["PENDING", "PAID"]),
              },
            });
          }
        }
      }
    }

    console.info("✅ Expenses created successfully");

    console.info("📈 Creating investments...");

    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        await prisma.investment.create({
          data: {
            amount: faker.number.float({
              min: 100,
              max: 10000,
              fractionDigits: 2,
            }),
            investedAt: faker.date.between({
              from: new Date(2023, 0, 1),
              to: new Date(),
            }),
            notes: faker.lorem.sentence(),
            userId: user.id,
            categoryId: faker.helpers.arrayElement(investmentCategories).id,
          },
        });
      }
    }

    console.info("✅ Investments created successfully");

    const end = Date.now();
    console.info(`✅ Seed completed in ${end - start}ms`);
  } catch (err) {
    console.error("❌ Seed failed");
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
