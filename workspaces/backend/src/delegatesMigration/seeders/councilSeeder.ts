import {db} from "../../db/db";
import {eq} from "drizzle-orm";
import {councils} from "../../db/schema/councils";
import {Algolia} from "../../utils/algolia";
import slugify from "slugify";
import {users} from "../../db/schema/users";
import {usersToCouncils} from "../../db/schema/usersToCouncils";
import {posts} from "../../db/schema/posts";
import {adminUsers} from "../index";

export async function createCouncils() {
  const councilsData = [
    {
      name: 'Builder Council',
      description: 'Description of Builder Council',
      statement: 'Statement of Builder Council',
    },
    {
      name: 'Security Council',
      description: 'Description of Security Council',
      statement: 'Statement of Security Council',
    },
  ];

  console.log('Creating Councils');

  for (const councilData of councilsData) {
    const existingCouncil = await db.query.councils.findFirst({
      where: eq(councils.name, councilData.name),
    });

    if (existingCouncil) {
      console.log(`Council ${councilData.name} already exists.`);
      console.log(`Updating council ${councilData.name} on alogolia.`);
      await Algolia.updateObjectFromIndex({
        name: existingCouncil.name || '',
        type: 'council',
        refID: existingCouncil.slug || existingCouncil.id,
        content: existingCouncil.description + ' ' + existingCouncil.statement,
      });
      continue; // Skip to the next council if this one already exists
    } else {
      console.log(`Creating Council ${councilData.name}.`);
    }

    const insertedCouncil = await db
      .insert(councils)
      .values({
        name: councilData.name,
        description: councilData.description,
        statement: councilData.statement,
        slug: slugify(councilData.name, { replacement: '_', lower: true }),
        address: 'dummy_address', // Adjust as necessary
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log(`Saving Council ${insertedCouncil[0].id} to Algolia.`);
    await Algolia.saveObjectToIndex({
      name: insertedCouncil[0].name || '',
      type: 'council',
      refID: insertedCouncil[0].slug || insertedCouncil[0].id,
      content:
        insertedCouncil[0].description + ' ' + insertedCouncil[0].statement,
    });

    const councilId = insertedCouncil[0].id;

    // Add admin users to council
    for (const address of adminUsers) {
      const user = await db.query.users.findFirst({
        where: eq(users.address, address),
      });
      if (user) {
        await db
          .insert(usersToCouncils)
          .values({
            userId: user.id,
            councilId: councilId,
          })
          .execute();
      }
    }

    console.log('Creating Posts');

    // Create dummy posts
    const dummyPosts = [
      {
        title: 'Dummy Post 1',
        content: 'Content of dummy post 1',
        councilId: councilId,
      },
      {
        title: 'Dummy Post 2',
        content: 'Content of dummy post 2',
        councilId: councilId,
      },
    ];

    for (const post of dummyPosts) {
      await db
        .insert(posts)
        .values({
          title: post.title,
          content: post.content,
          councilId: post.councilId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();
    }

    console.log('Posts Created');
  }
}
