import { table, getMinifiedRecords } from "@/lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const findCoffeeStoresRecord = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (findCoffeeStoresRecord.length != 0) {
        const record = getMinifiedRecords(findCoffeeStoresRecord);
        res.json(record);
      } else {
        res.json({ message: "id could not be found" });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
};

export default getCoffeeStoreById;
