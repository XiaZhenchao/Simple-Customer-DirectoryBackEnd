/**
 * @file Database Service Module
 * @description Handles all database interactions for user and customer operations including 
 *              creating, reading, updating, and deleting records in MySQL. 
 *              Manages connection pooling and queries using mysql2 package.
 * @author Nathan Xia
 * @version 1.0.0
 */

import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getCustomerSystemUser(){
    const[rows] = await pool.query("SELECT * FROM users")
    return rows
}


export async function createCustomerSystemUser(name, email, password) {
    const [result] = await pool.query(
        `INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())`,
        [name, email, password]
    );
    return result
}

export async function verifyCustomerSystemUser(email, password) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password]
    );
    return rows;
}

export async function getCustomerSystemCustomer() {
    const [rows] = await pool.query("SELECT * FROM customer");
    return rows;
  }
  
  export async function createCustomerSystemCustomer(
    name,
    email,
    company_name,
    phone,
    profile_picture_url,
    contract_start_date,
    contract_expire_date
  ) {
    const [result] = await pool.query(
      `INSERT INTO customer 
       (name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date]
    );
    return result;
  }
  
  export async function deleteCustomerSystemCustomer(id) {
    const [result] = await pool.query(
      "DELETE FROM customer WHERE id = ?",
      [id]
    );
    return result;
  }

  export async function updateCustomerSystemCustomer(id, updatedCustomer) {
    const [result] = await pool.query(
      `UPDATE customer SET 
        name = ?, 
        email = ?, 
        company_name = ?, 
        phone = ?, 
        profile_picture_url = ?, 
        contract_start_date = ?, 
        contract_expire_date = ?
      WHERE id = ?`,
      [
        updatedCustomer.name,
        updatedCustomer.email,
        updatedCustomer.company_name,
        updatedCustomer.phone,
        updatedCustomer.profile_picture_url,
        updatedCustomer.contract_start_date,
        updatedCustomer.contract_expire_date,
        id
      ]
    );
    return result;
  }


// export { getCustomerSystemUser, getCustomerSystemUserByName, createCustomerSystemUser, verifyCustomerSystemUser };