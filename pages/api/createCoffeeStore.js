const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE);

// by default every serverless function is a get Request

const table = base("coffee-stores");

const createCoffeeStore = async (req, res) => {
  const { id, name, locality, address, imgUrl, voting } = req.body;

  try {
    if (id) {
      // find a record
      const findCoffeeStoresRecord = await table
        .select({
          filterByFormula: `id=${id}`,
        })
        .firstPage();

      if (findCoffeeStoresRecord.length != 0) {
        const records = findCoffeeStoresRecord.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      }
    } else {
      // create the record

      if (id && name) {
        const createRecords = await table.create([
          {
            fields: {
              id,
              name,
              address,
              locality,
              voting,
              imgUrl,
            },
          },
        ]);
        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json({ records });
      } else {
        req.status(400);
        res.json({ message: "Id or name is missing" });
      }
    }
  } catch (err) {
    console.log("Error finding store --> ", { err });
    res.status(500);
  }
};

export default createCoffeeStore;
