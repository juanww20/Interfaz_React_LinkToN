import React, { useEffect, useRef, useState, useCallback } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import Swal from "sweetalert2";
import { userService } from "../../services/project_2/userService";

export default function DatatableComponente() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const userTable = useRef(null);
  const modalRef = useRef(null);

  const itemsPerPage = 10;

  const userFields = [
    { key: "firstName", label: "Nombre" },
    { key: "lastName", label: "Apellido" },
    { key: "maidenName", label: "Segundo Apellido" },
    { key: "age", label: "Edad" },
    { key: "gender", label: "Género" },
    { key: "birthDate", label: "Fecha de nacimiento" },
    { key: "bloodGroup", label: "Grupo sanguíneo" },
    { key: "height", label: "Altura" },
    { key: "weight", label: "Peso" },
    { key: "eyeColor", label: "Color de ojos" },
    { key: "hair_color", label: "Color de cabello" },
    { key: "hair_type", label: "Tipo de cabello" },
    { key: "image", label: "Imagen" },
    { key: "email", label: "Correo electrónico" },
    { key: "phone", label: "Teléfono" },
    { key: "user_name", label: "Usuario" },
    { key: "ip", label: "IP" },
    { key: "macAddress", label: "MAC Address" },
    { key: "userAgent", label: "User Agent" },
    { key: "address_address", label: "Dirección" },
    { key: "address_city", label: "Ciudad" },
    { key: "address_state", label: "Estado" },
    { key: "address_stateCode", label: "Código de estado" },
    { key: "address_postalCode", label: "Código postal" },
    { key: "address_coordinates_lat", label: "Latitud" },
    { key: "address_coordinates_lng", label: "Longitud" },
    { key: "address_country", label: "País" },
    { key: "university", label: "Universidad" },
    { key: "bank_cardExpire", label: "Vencimiento tarjeta" },
    { key: "bank_cardNumber", label: "Número de tarjeta" },
    { key: "bank_cardType", label: "Tipo de tarjeta" },
    { key: "bank_currency", label: "Moneda" },
    { key: "bank_iban", label: "IBAN" },
    { key: "crypto_coin", label: "Criptomoneda" },
    { key: "crypto_wallet", label: "Wallet" },
    { key: "crypto_network", label: "Red cripto" },
    { key: "company_department", label: "Departamento" },
    { key: "company_name", label: "Empresa" },
    { key: "company_title", label: "Cargo" },
    { key: "company_address_address", label: "Dirección empresa" },
    { key: "company_address_city", label: "Ciudad empresa" },
    { key: "company_address_state", label: "Estado empresa" },
    { key: "company_address_stateCode", label: "Código estado empresa" },
    { key: "company_address_postalCode", label: "Código postal empresa" },
    { key: "company_address_coordinates_lat", label: "Latitud empresa" },
    { key: "company_address_coordinates_lng", label: "Longitud empresa" },
    { key: "company_address_country", label: "País empresa" },
    { key: "ein", label: "EIN" },
    { key: "ssn", label: "SSN" },
  ];

  const logoBase64 =
    "data:image/png;base64,iVBORw0K..."; // <-- recorta tu base64 aquí para no alargar

  const paginatedUserFields = userFields.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(userFields.length / itemsPerPage);

  const getNestedValue = (obj, key) => {
    if (!obj) return "";
    return obj[key] ?? "";
  };

  const getAllUsers = useCallback(async () => {
    const result = await userService.getUsers();
    if (result) {
      setAllUsers([...result.active, ...result.desactive]);
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable(userTable.current)) {
          $(userTable.current).DataTable().destroy();
        }
        $(userTable.current).DataTable({
          dom: "Bfrtip",
          buttons: [
            {
              extend: "excelHtml5",
              title: "Usuarios",
              text: "Exportar a Excel",
              className: "btn btn-success",
              exportOptions: {
                columns: ":not(:last-child)",
              },
            },
            {
              extend: "pdfHtml5",
              title: "Usuarios",
              text: "Exportar a PDF",
              exportOptions: {
                columns: ":not(:last-child)",
              },
              customize: function (doc) {
                doc.content.splice(0, 0, {
                  margin: [0, 0, 0, 12],
                  alignment: "center",
                  image: logoBase64,
                  width: 50,
                });
              },
              className: "btn btn-danger",
            },
          ],
        });
      }, 100);
    }
  }, []);

  const viewUser = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.focus();
    }, 50);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setCurrentPage(1);
  };

  const toggleUser = async (user) => {
    const action = user.status ? "deshabilitar" : "habilitar";
    const result = await Swal.fire({
      title: `¿Estás seguro de ${action} a este usuario?`,
      text: `Esta acción puede revertirse.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await userService.updateUser(user.user_id, {
        status: !user.status,
      });
      if (success) {
        Swal.fire(
          "¡Listo!",
          `El usuario fue ${action}do correctamente.`,
          "success"
        );
        getAllUsers();
      } else {
        Swal.fire("Error", "Hubo un problema al actualizar el usuario.", "error");
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="container mt-4">
      <h2>Gestión de Usuarios</h2>
      <table ref={userTable} className="table table-striped" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_name}</td>
              <td>{user.email}</td>
              <td>{user.status ? "Activo" : "Inactivo"}</td>
              <td>{user.role_id}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => viewUser(user)}>
                  Ver
                </button>
                <button
                  className={`btn btn-sm ${user.status ? "btn-danger" : "btn-success"}`}
                  onClick={() => toggleUser(user)}
                >
                  {user.status ? "Deshabilitar" : "Habilitar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          className="modal"
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          ref={modalRef}
          onClick={(e) => e.target.classList.contains("modal") && closeModal()}
          onKeyDown={(e) => e.key === "Escape" && closeModal()}
        >
          <div className="modal-content" tabIndex={0}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">
                Detalles del Usuario
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar modal"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              {paginatedUserFields.map((field) => (
                <div key={field.key} className="field-item">
                  <p>
                    <strong>{field.label}:</strong>{" "}
                    {field.key === "image"
                      ? selectedUser?.[field.key]
                        ? selectedUser[field.key].slice(0, 15) + "..."
                        : ""
                      : getNestedValue(selectedUser, field.key)}
                  </p>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
        }
        button {
          margin-right: 5px;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          outline: none;
          backdrop-filter: blur(5px);
        }
        .modal-content {
          background: #fff;
          padding: 30px 25px;
          border-radius: 12px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          outline: none;
          animation: modalFadeIn 0.3s ease forwards;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #222;
        }
        .btn-close {
          background: transparent;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          line-height: 1;
          color: #999;
          transition: color 0.3s ease;
        }
        .btn-close:hover {
          color: #ff4d4f;
        }
        .modal-body p {
          margin: 10px 0;
          font-size: 1rem;
          color: #444;
          line-height: 1.4;
        }
        .modal-body p strong {
          color: #222;
        }
        .modal-footer {
          text-align: right;
          margin-top: 25px;
        }
        .modal-footer .btn-secondary {
          background-color: #007bff;
          border: none;
          color: white;
          padding: 8px 18px;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .modal-footer .btn-secondary:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
