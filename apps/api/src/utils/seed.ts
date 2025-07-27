import { auth } from "@/lib/auth";

(async () => {
  try {
    console.info("⏳ Running seed...");
    const start = Date.now();

    console.info("📝 Creating admin users...");
    try {
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

      const end = Date.now();
      console.info(`✅ Seed completed in ${end - start}ms`);
    } catch {
      console.error("❌ Failed to create users");
    }
  } catch (err) {
    console.error("❌ Seed failed");
    console.error(err);
    process.exit(1);
  }
})();
