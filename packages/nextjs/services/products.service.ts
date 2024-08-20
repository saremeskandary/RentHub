import axios from "axios";

interface IGetProducts {
  id: number;
  price: string;
  date: string;
  img: string;
  title: string;
  text: string;
}

class ProductsService {
  private BASE_URL = "https://dbfdde8e8c509198.mokky.dev";

  async getProducts() {
    const { data } = await axios.get<IGetProducts[]>(`${this.BASE_URL}/items`);
    return data;
  }

  async getProductsById(id: string | any) {
    const { data } = await axios.get<IGetProducts>(`${this.BASE_URL}/items/${id}`);
    return data;
  }
}

export const productsService = new ProductsService();
