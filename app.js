/**
 * @file Server Application Entry Point
 * @description Sets up the Express server, handles user and customer-related API routes, 
 *              connects to MySQL database, and manages error handling.
 *              Provides endpoints for user registration, login, fetching customers, 
 *              creating, updating, and deleting customers.
 * @author Nathan Xia
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors'
import { getCustomerSystemUser, 
    createCustomerSystemUser, 
    verifyCustomerSystemUser,
    getCustomerSystemCustomer,
    createCustomerSystemCustomer,
    deleteCustomerSystemCustomer,
    updateCustomerSystemCustomer
} from './database.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/users", async (req, res) => {
    const result = await getCustomerSystemUser();
    res.send(result);
});

app.get("/users/:name", async (req, res) => {
    const name = req.params.name;
    const result = await getCustomerSystemUserByName(name);
    res.send(result);
});

app.post("/users/register", async (req, res) => {
    const { name, email, password } = req.body;
    const result = await createCustomerSystemUser(name, email, password);
    res.status(201).send(result);
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
  
    const result = await verifyCustomerSystemUser(email, password);
  
    if (result.length > 0) {
      res.status(200).json({ success: true, user: result[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });

  app.get("/customers", async (req, res) => {
    try {
      const result = await getCustomerSystemCustomer();
      res.status(200).send(result);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch customers' });
    }
  });
  
  app.post("/customers", async (req, res) => {
    const {
      name,
      email,
      company_name,
      phone,
      profile_picture_url,
      contract_start_date,
      contract_expire_date
    } = req.body;
  
    try {
      const result = await createCustomerSystemCustomer(
        name,
        email,
        company_name,
        phone,
        profile_picture_url,
        contract_start_date,
        contract_expire_date
      );
      res.status(201).send(result);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ success: false, message: 'Failed to create customer' });
    }
  });
  
  app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const result = await deleteCustomerSystemCustomer(id);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ success: false, message: 'Failed to delete customer' });
    }
  });

  app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    try {
      const result = await updateCustomerSystemCustomer(id, updatedData);
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ success: false, message: 'Failed to update customer' });
    }
  });


app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

app.listen(8080, () => {
    console.log('server is running on port 8080');
});
