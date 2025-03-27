import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { db } from "./dbConnection";
import { usersTable } from "../../drizzle/schema";
import { eq, or } from "drizzle-orm";
import { generateId } from "../utils/generateId";

dotenv.config();

const BASE_URL = process.env.BASE_URL;
// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists (sign in)
        const existingUser = await db
          .select()
          .from(usersTable)
          .where(
            or(
              eq(usersTable.google_id, profile.id),
              eq(usersTable.email, profile.emails![0].value)
            )
          )
          .limit(1);
        if (existingUser && existingUser.length > 0) {
          return done(null, existingUser[0]);
        }

        // User doesn't exist, create new user (sign up)
        const newUser = {
          user_id: generateId(),
          email: profile.emails![0].value,
          name: profile.displayName,
          avatar: profile.photos?.[0].value || null,
          google_id: profile.id,
          isVerified: true,
        };

        await db.insert(usersTable).values(newUser);
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.google_id, profile.id))
          .limit(1);

        return done(null, user[0]);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload, done) => {
      try {
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.user_id, payload.id))
          .limit(1);

        if (!user || user.length === 0) {
          return done(null, false);
        }

        console.log(user[0]);
        return done(null, user[0]);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;
