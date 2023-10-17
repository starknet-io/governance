import {learnPageSections} from "../learnPageContent";
import slugify from "slugify";
import {db} from "../../db/db";
import {eq} from "drizzle-orm";
import {pages} from "../../db/schema/pages";
import {Algolia} from "../../utils/algolia";

export async function createLearnSections(userId: string | null) {
  let index = 0;
  console.log('Creating Learn Sections');
  for (const page of learnPageSections) {
    const slug = slugify(page.title, { replacement: '_', lower: true });
    // Check if the Learn section with the given slug already exists
    const existingPage = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    });

    if (existingPage) {
      console.log(`Learn Section with slug ${slug} already exists.`);
      console.log(`Updating Learn Section ${existingPage.id} in Algolia.`);
      await Algolia.updateObjectFromIndex({
        name: existingPage.title || '',
        type: 'learn',
        refID: slugify(page.title, { replacement: '_', lower: true }),
        content: existingPage.content || '',
      });

      continue; // Skip to the next iteration if this Learn section already exists
    }

    const content = page.content;
    const title = page.title;
    index = index + 1;
    const orderNumber = index;

    let newPageContent = {
      title,
      content,
      orderNumber,
      userId: userId,
      slug: slugify(title, { replacement: '_', lower: true }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (page.parentId) {
      const foundParent = learnPageSections.find(
        (parentPage) => parentPage.id === page.parentId,
      );
      if (foundParent) {
        const pageParent = await db.query.pages.findFirst({
          where: eq(pages.title, foundParent.title),
        });
        if (pageParent) {
          newPageContent = {
            ...newPageContent,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            parentId: pageParent.id,
          };
        }
      }
    }

    const insertedPage = await db
      .insert(pages)
      .values(newPageContent)
      .returning();

    console.log(`Saving Learn Section ${insertedPage[0].id} to Algolia.`);
    await Algolia.saveObjectToIndex({
      name: page.title || '',
      type: 'learn',
      refID: page.id,
      content: page.content || '',
    });
  }
  console.log('Learn Sections Created');
}
