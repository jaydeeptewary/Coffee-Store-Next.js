import { table, findRecordsByFilter, getMinifiedRecords } from "@/lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordsByFilter(id);

        if (records.length != 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;

          // now we would like to update our data present in AirTable
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);
          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Coffee Store ID not found to upvote it", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Error Upvoting our coffee Store", err });
    }
  }
};

export default favouriteCoffeeStoreById;
