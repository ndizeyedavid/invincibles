import { and, eq, ne, or } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { conversationsTable, messagesTable } from "../../drizzle/schema";
import { CreateConverstion } from "../types/conversation";

export const create = async (data: CreateConverstion) => {
  try {
    return await db.insert(conversationsTable).values(data);
  } catch (error) {
    throw error;
  }
};

// export const update = async (data: UpdateProperty) => {
//   try {
//     return await db
//       .update(propertiesTable)
//       .set(data)
//       .where(eq(propertiesTable.property_id, data.property_id));
//   } catch (error) {
//     throw error;
//   }
// };

export const findByLoggedinuser = async (
  user_Id: string,
  offset: number,
  limit: number
) => {
  try {
    return await db.query.conversationsTable.findMany({
      where: or(
        and(
          eq(conversationsTable.renter_id, user_Id),
          ne(conversationsTable.status, "DELETED")
        ),
        and(
          eq(conversationsTable.host_id, user_Id),
          ne(conversationsTable.status, "DELETED")
        )
      ),
      offset,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

export const findById = async (conversation_id: string) => {
  try {
    return await db.query.conversationsTable.findFirst({
      where: eq(conversationsTable.conversation_id, conversation_id),
    });
  } catch (error) {
    throw error;
  }
};

export const findbyHosterRenterAndPropertyId = async (
  host_id: string,
  renter_id: string,
  property_id: string
) => {
  try {
    return await db.query.conversationsTable.findFirst({
      where: and(
        eq(conversationsTable.host_id, host_id),
        eq(conversationsTable.renter_id, renter_id),
        eq(conversationsTable.property_id, property_id),
        ne(conversationsTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};
// export const deleteById = async (property_id: string) => {
//   try {
//     return await db
//       .update(propertiesTable)
//       .set({
//         deleted_at: new Date(),
//         status: "DELETED",
//       })
//       .where(eq(propertiesTable.property_id, property_id));
//   } catch (error) {
//     throw error;
//   }
// };
