const Property = require('../models/propertyModel');
const { options } = require('../routes/propertyRoutes');


module.exports = {
  async postProperty(req, res) {
    try {
      // Fetch user ID from the session
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).send({ message: 'Unauthorized: User not logged in' });
      }
      const property = new Property({
        title: req.body.title,
        content: req.body.content,
        images: req.body.images,
        city: req.body.city,
        area: req.body.area,
        locality: req.body.locality,
        floor: req.body.floor,
        propertyType: req.body.propertyType,
        transactionType: req.body.transactionType,
        option: req.body.option,
        price: req.body.price,
        areaSqft: req.body.areaSqft,
        ownerName: req.body.ownerName,
        contactNumber: req.body.contactNumber,
        facingDirection: req.body.facingDirection,
        status: req.body.status,
        userId: userId
      });

      await property.save();
      res.send('Property posted successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error posting property' });
    }
  },

  
  async postProperty(req, res) {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).send({ message: 'Unauthorized: User not logged in' });
      }

      const property = new Property({
        ...req.body,
        userId: userId
      });

      await property.save();
      res.send('Property posted successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error posting property' });
    }
  },

  async updateProperty(req, res) {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).send({ message: 'Unauthorized: User not logged in' });
      }

      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: req.body }, // Update fields using $set
        { new: true, runValidators: true } // Return updated document and run validation
      ).lean(); // Convert to plain JavaScript object

      if (!updatedProperty) {
        return res.status(404).send({
          message: 'Property not found or you do not have permission to update it',
        });
      }

      res.json(updatedProperty);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).send({ message: 'Error updating property' });
      }
    }
  },

  async deleteProperty(req, res) {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).send({ message: 'Unauthorized: User not logged in' });
      }

      const deletedProperty = await Property.findByIdAndRemove(req.params.id).lean(); // Convert to plain JavaScript object

      if (!deletedProperty) {
        return res.status(404).send({
          message: 'Property not found or you do not have permission to delete it',
        });
      }

      res.status(204).send(); // No content for successful deletion
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).send({ message: 'Error deleting property' });
      }
    }
  },

  async viewProperty(req, res) {
    try {
      const property = await Property.findById(req.params.id).lean(); // Convert to plain JavaScript object

      if (!property) {
        return res.status(404).send({
          message: 'Property not found',
        });
      }

      res.json(property);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).send({ message: 'Error viewing property' });
      }
    }
  }
};
