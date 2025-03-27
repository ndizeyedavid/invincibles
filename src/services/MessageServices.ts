import { and, eq, ne } from "drizzle-orm";
import { messagesTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { CreateMessage } from "../types/message";

export const create = async (data: CreateMessage) => {
  try {
    return await db.insert(messagesTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const findMessagesByConversationId = async (conversation_id: string) => {
  try {
    return await db.query.messagesTable.findMany({
      where: eq(messagesTable.conversation_id, conversation_id),
    });
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

// export const findMany = async (offset: number, limit: number) => {
//   try {
//     return await db.query.propertiesTable.findMany({
//       where: ne(propertiesTable.status, "DELETED"),
//       offset,
//       limit,
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export const findById = async (message_id: string) => {
  try {
    return await db.query.messagesTable.findFirst({
      where: and(
        eq(messagesTable.message_id, message_id),
        ne(messagesTable.status, "DELETED")
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
