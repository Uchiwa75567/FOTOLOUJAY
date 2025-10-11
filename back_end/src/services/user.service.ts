import * as userRepository from "../repositories/user.repository";

export const getAllUsers = () => {
  return userRepository.findAll();
};

export const getUserById = (id: number) => {
  return userRepository.findById(id);
};

export const createUser = (data: any) => {
  return userRepository.create(data);
};

export const updateUser = (id: number, data: any) => {
  return userRepository.update(id, data);
};

export const deleteUser = (id: number) => {
  return userRepository.remove(id);
};
