// by default every serverless function is a get Request

import { table, getMinifiedRecords, findRecordsByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  // Find a record

  const { id, name, locality, address, imgUrl, voting } = req.body;
  try {
    if (id) {
      const records = await findRecordsByFilter(id);

      if (records.length != 0) {
        res.json(records);
      } else {
        // create the record
        if (name) {
          // name is required field for creating a new record
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
          const record = getMinifiedRecords(createRecords);
          res.json({ record });
        } else {
          res.status(400);
          res.json({ message: "name is missing" });
        }
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (err) {
    console.error("Error creating or finding a store --> ", err);
    res.status(500);
    res.json({ message: "Error creating or finding a store -->", err });
  }
};

export default createCoffeeStore;
