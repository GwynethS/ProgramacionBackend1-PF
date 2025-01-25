export class ProductManager {
  constructor(model) {
    this.model = model;
  }

  async findByQuery(query = {}) {
    try {
      const result = await this.model.find(query);

      return result;
    } catch (e) {
      return null;
    }
  }

  async findById(id) {
    try {
      const result = await this.model.findById(id);

      return result;
    } catch (e) {
      return null;
    }
  }

  async add(product) {
    try {
      const result = await this.model.create(product);

      return result;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async update(product, id) {
    try {
      const result = await this.model.findByIdAndUpdate(id, product, {
        new: true,
      });

      return result;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async deleteById(id) {
    try {
      const result = await this.model.deleteOne({_id: id});

      return result;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }
}
