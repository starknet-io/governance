import algoliasearch from 'algoliasearch';

type RecordType = 'voting_proposal' | 'council' | 'learn' | 'delegate';
interface RecordData {
  name?: string;
  type?: RecordType;
  refID: number | string;
  content?: string;
  avatar?: string;
  address?: string;
}

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID ?? '',
  process.env.ALGOLIA_API_KEY ?? '',
);

const INDEX = process.env.ALOGLIA_INDEX ?? '';
const index = client.initIndex(INDEX);

async function saveObjectToIndex(data: RecordData) {
  try {
    await index
      .saveObject({
        ...data,
        objectID: `${data.type}-${data.refID}`,
      })
      .wait();
  } catch (error) {
    console.log(error);
  }
}

async function saveObjectsToIndex(data: RecordData[]) {
  try {
    const objects = data.map(item => ({
      ...item,
      objectID: `${item.type}-${item.refID}`
    }));
    await index.saveObjects(objects).wait();
  } catch (error) {
    console.log(error);
  }
}


async function updateObjectFromIndex(data: RecordData) {
  try {
    await index.partialUpdateObject({
      ...data,
      objectID: `${data.type}-${data.refID}`,
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteObjectFromIndex({
  refID,
  type,
}: {
  refID: number | string;
  type: RecordType;
}) {
  try {
    await index.deleteObject(`${type}-${refID}`);
  } catch (error) {
    console.log(error);
  }
}

export const Algolia = {
  saveObjectToIndex,
  deleteObjectFromIndex,
  updateObjectFromIndex,
  saveObjectsToIndex,
};
