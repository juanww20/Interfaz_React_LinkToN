import React, { useState, useCallback, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Divider,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import { userService } from '../services/project_2/userService';
import MapModal from './Map/MapModal';
const genders = ['Masculino', 'Femenino', 'Otro'];

// Estilos
const FormContainer = styled(Paper)(({ theme }) => ({
  maxWidth: '90%',
  height: 'auto',
  margin: '20px auto',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const NameFields = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  }
}));

const FormActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const ImageSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  }
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  }
}));

const ErrorMessage = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  backgroundColor: theme.palette.error.light,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

// Componente para el paso 1
const Step1 = ({ formData, handleInputChange, updateImagePreview, onFileSelected, imagePreviewUrl, handleNext }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Nombre*" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Apellido*" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Segundo apellido" value={formData.maidenName} onChange={(e) => handleInputChange('maidenName', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Edad*" type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Género*</InputLabel>
          <Select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} label="Género*">
            {genders.map((gender) => (
              <MenuItem key={gender} value={gender}>{gender}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField fullWidth label="Fecha de nacimiento*" placeholder="ddMMyyyy (Ej: 01072005)" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 8 }} helperText="Formato: ddMMyyyy" />
        <TextField fullWidth label="Grupo sanguíneo" value={formData.bloodGroup} onChange={(e) => handleInputChange('bloodGroup', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 3 }} />
        <TextField fullWidth label="Altura (cm)" type="number" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 3 }} />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="Peso (kg)" type="number" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 3 }} />
        <TextField fullWidth label="Color de ojos" value={formData.eyeColor} onChange={(e) => handleInputChange('eyeColor', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 15 }} />
        <TextField fullWidth label="Color de cabello" value={formData.hair_color} onChange={(e) => handleInputChange('hair_color', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 15 }} />
        <TextField fullWidth label="Tipo de cabello" value={formData.hair_type} onChange={(e) => handleInputChange('hair_type', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 15 }} />
      </NameFields>

      <ImageSection>
        <TextField
          fullWidth
          label="URL de imagen"
          value={formData.imageUrl || ""}
          onChange={(e) => updateImagePreview(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
        />      
        </ImageSection>

      <ImagePreviewContainer>
        <Button variant="outlined" component="label" startIcon={<span>📷</span>} sx={{ minWidth: '200px' }}>
          Cargar imagen
          <input type="file" accept="image/*" hidden onChange={onFileSelected} />
        </Button>

        {imagePreviewUrl && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box component="img" src={imagePreviewUrl} sx={{ maxWidth: 150, maxHeight: 150, border: '1px solid #e0e0e0', borderRadius: 1 }} alt="Vista previa" />
            <Typography variant="caption" sx={{ mt: 1 }}>{formData.imageFile ? formData.imageFile.name : 'Imagen URL'}</Typography>
          </Box>
        )}
      </ImagePreviewContainer>

      <FormActions>
        <Button color="primary" onClick={handleNext} variant="contained">Siguiente</Button>
      </FormActions>
    </Box>
  );
};

// Componente para el paso 2
const Step2 = ({ formData, handleInputChange, handleBack, handleNext }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Correo Electrónico" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Contraseña" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} variant="outlined" size="small" inputProps={{ maxLength: 15 }} />
        <TextField fullWidth label="Telefono" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Usuario" value={formData.user_name} onChange={(e) => handleInputChange('user_name', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="IP" value={formData.ip} onChange={(e) => handleInputChange('ip', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="MAC Address" value={formData.macAddress} onChange={(e) => handleInputChange('macAddress', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="User Agent" value={formData.userAgent} onChange={(e) => handleInputChange('userAgent', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">Siguiente</Button>
      </FormActions>
    </Box>
  );
};

// Componente para el paso 3
const Step3 = ({ formData, handleInputChange, handleBack, handleNext }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenMap = () => {
    setIsModalOpen(true);
  };

  const handleCloseMap = (data) => {
    setIsModalOpen(false);
    if (data) {
      // Llenar los campos del formulario con la ubicación seleccionada
      handleInputChange("address_address", data.adress || "");
      handleInputChange("address_city", data.city || "");
      handleInputChange("address_state", data.state || "");
      handleInputChange("address_postalCode", data.postcode || "");
      handleInputChange("address_country", data.country || "");
      handleInputChange("address_coordinates_lat", data.lat || "");
      handleInputChange("address_coordinates_lng", data.lng || "");
      handleInputChange("university", data.university || "");
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField
          fullWidth
          label="Dirección"
          value={formData.address_address}
          onChange={(e) =>
            handleInputChange("address_address", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Ciudad"
          value={formData.address_city}
          onChange={(e) => handleInputChange("address_city", e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Estado"
          value={formData.address_state}
          onChange={(e) => handleInputChange("address_state", e.target.value)}
          variant="outlined"
          size="small"
        />
      </NameFields>

      <NameFields>
        <TextField
          fullWidth
          label="Código postal"
          value={formData.address_postalCode}
          onChange={(e) =>
            handleInputChange("address_postalCode", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Código estado"
          value={formData.address_stateCode}
          onChange={(e) =>
            handleInputChange("address_stateCode", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Latitud"
          value={formData.address_coordinates_lat}
          onChange={(e) =>
            handleInputChange("address_coordinates_lat", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Longitud"
          value={formData.address_coordinates_lng}
          onChange={(e) =>
            handleInputChange("address_coordinates_lng", e.target.value)
          }
          variant="outlined"
          size="small"
        />
      </NameFields>

      <NameFields>
        <TextField
          fullWidth
          label="País"
          value={formData.address_country}
          onChange={(e) => handleInputChange("address_country", e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Universidad"
          value={formData.university}
          onChange={(e) => handleInputChange("university", e.target.value)}
          variant="outlined"
          size="small"
        />
      </NameFields>

      {/* Botón para abrir el mapa */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpenMap}
        >
          Seleccionar ubicación en mapa
        </Button>
      </Box>

      {/* Modal con el mapa */}
      {isModalOpen && <MapModal onClose={handleCloseMap} />}

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">
          Siguiente
        </Button>
      </FormActions>
    </Box>
  );
};
// Componente para el paso 4
const Step4 = ({ formData, handleInputChange, handleBack, handleNext }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Vencimiento tarjeta" value={formData.bank_cardExpire} onChange={(e) => handleInputChange('bank_cardExpire', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Número de tarjeta" value={formData.bank_cardNumber} onChange={(e) => handleInputChange('bank_cardNumber', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Tipo de tarjeta" value={formData.bank_cardType} onChange={(e) => handleInputChange('bank_cardType', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Moneda" value={formData.bank_currency} onChange={(e) => handleInputChange('bank_currency', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="IBAN" value={formData.bank_iban} onChange={(e) => handleInputChange('bank_iban', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Criptomoneda" value={formData.crypto_coin} onChange={(e) => handleInputChange('crypto_coin', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Wallet" value={formData.crypto_wallet} onChange={(e) => handleInputChange('crypto_wallet', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Red cripto" value={formData.crypto_network} onChange={(e) => handleInputChange('crypto_network', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">Siguiente</Button>
      </FormActions>
    </Box>
  );
};

// Componente para el paso 5
const Step5 = ({ formData, handleInputChange, handleBack, handleNext }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenMap = () => {
    setIsModalOpen(true);
  };

  const handleCloseMap = (data) => {
    setIsModalOpen(false);
    if (data) {
      // Rellenar los campos de la empresa con la ubicación seleccionada
      handleInputChange("company_address_address", data.adress || "");
      handleInputChange("company_address_city", data.city || "");
      handleInputChange("company_address_state", data.state || "");
      handleInputChange("company_address_postalCode", data.postcode || "");
      handleInputChange("company_address_country", data.country || "");
      handleInputChange("company_address_coordinates_lat", data.lat || "");
      handleInputChange("company_address_coordinates_lng", data.lng || "");
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField
          fullWidth
          label="Departamento"
          value={formData.company_department}
          onChange={(e) =>
            handleInputChange("company_department", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Empresa"
          value={formData.company_name}
          onChange={(e) => handleInputChange("company_name", e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Cargo"
          value={formData.company_title}
          onChange={(e) => handleInputChange("company_title", e.target.value)}
          variant="outlined"
          size="small"
        />
      </NameFields>

      <NameFields>
        <TextField
          fullWidth
          label="Dirección empresa"
          value={formData.company_address_address}
          onChange={(e) =>
            handleInputChange("company_address_address", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Ciudad empresa"
          value={formData.company_address_city}
          onChange={(e) =>
            handleInputChange("company_address_city", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Estado empresa"
          value={formData.company_address_state}
          onChange={(e) =>
            handleInputChange("company_address_state", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Código estado empresa"
          value={formData.company_address_stateCode}
          onChange={(e) =>
            handleInputChange("company_address_stateCode", e.target.value)
          }
          variant="outlined"
          size="small"
        />
      </NameFields>

      <NameFields>
        <TextField
          fullWidth
          label="Código postal empresa"
          value={formData.company_address_postalCode}
          onChange={(e) =>
            handleInputChange("company_address_postalCode", e.target.value)
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Latitud empresa"
          value={formData.company_address_coordinates_lat}
          onChange={(e) =>
            handleInputChange(
              "company_address_coordinates_lat",
              e.target.value
            )
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Longitud empresa"
          value={formData.company_address_coordinates_lng}
          onChange={(e) =>
            handleInputChange(
              "company_address_coordinates_lng",
              e.target.value
            )
          }
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="País empresa"
          value={formData.company_address_country}
          onChange={(e) =>
            handleInputChange("company_address_country", e.target.value)
          }
          variant="outlined"
          size="small"
        />
      </NameFields>

      <NameFields>
        <TextField
          fullWidth
          label="EIN"
          value={formData.ein}
          onChange={(e) => handleInputChange("ein", e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="SSN"
          value={formData.ssn}
          onChange={(e) => handleInputChange("ssn", e.target.value)}
          variant="outlined"
          size="small"
        />
      </NameFields>

      {/* Botón para abrir el mapa */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpenMap}
        >
          Seleccionar ubicación de la empresa en mapa
        </Button>
      </Box>

      {/* Modal con el mapa */}
      {isModalOpen && <MapModal onClose={handleCloseMap} />}

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">
          Siguiente
        </Button>
      </FormActions>
    </Box>
  );
};
// Componente para el paso 6
const Step6 = ({ handleBack, handleSubmit, missingRequiredFields, submitAttempted }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      {/* Mensaje de error global */}
      {submitAttempted && missingRequiredFields.length > 0 && (
        <ErrorMessage>
          <WarningIcon color="error" />
          <Box>
            <Typography variant="body1" gutterBottom>
              Faltan los siguientes campos obligatorios:
            </Typography>
            <List dense>
              {missingRequiredFields.map((field, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <WarningIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={field} />
                </ListItem>
              ))}
            </List>
          </Box>
        </ErrorMessage>
      )}

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Enviar
        </Button>
      </FormActions>
    </Box>
  );
};

// Componente principal del formulario
const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, setFormData] = useState({
    // Paso 1
    firstName: '',
    lastName: '',
    maidenName: '',
    age: '',
    gender: '',
    birthDate: '',
    bloodGroup: '',
    height: '',
    weight: '',
    eyeColor: '',
    hair_color: '',
    hair_type: '',
    imageUrl: '',
    imageFile: null,

    // Paso 2
    email: '',
    password: '',
    phone: '',
    user_name: '',
    ip: '',
    macAddress: '',
    userAgent: '',

    // Paso 3
    address_address: '',
    address_city: '',
    address_state: '',
    address_postalCode: '',
    address_stateCode: '',
    address_coordinates_lat: '',
    address_coordinates_lng: '',
    address_country: '',
    university: '',

    // Paso 4
    bank_cardExpire: '',
    bank_cardNumber: '',
    bank_cardType: '',
    bank_currency: '',
    bank_iban: '',
    crypto_coin: '',
    crypto_network: '',
    crypto_wallet: '',

    // Paso 5
    company_department: '',
    company_name: '',
    company_title: '',
    company_address_address: '',
    company_address_city: '',
    company_address_state: '',
    company_address_stateCode: '',
    company_address_postalCode: '',
    company_address_coordinates_lat: '',
    company_address_coordinates_lng: '',
    company_address_country: '',
    companyLongitude: '',
    companyCountry: '',
    ein: '',
    ssn: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [missingRequiredFields, setMissingRequiredFields] = useState([]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const onFileSelected = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const updateImagePreview = useCallback((url) => {
    setImagePreviewUrl(url);
    handleInputChange('imageUrl', url);
  }, [handleInputChange]);

  const handleNext = useCallback(() => {
    setActiveStep(prevStep => prevStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(prevStep => prevStep - 1);
  }, []);

  const checkRequiredFields = useCallback(() => {
    const requiredFields = [
      { field: 'firstName', label: 'Nombre' },
      { field: 'lastName', label: 'Apellido' },
      { field: 'age', label: 'Edad' },
      { field: 'gender', label: 'Género' },
      { field: 'birthDate', label: 'Fecha de nacimiento' },
    ];

    const missing = requiredFields
      .filter(({ field }) => !formData[field])
      .map(({ label }) => label);

    setMissingRequiredFields(missing);
    return missing.length === 0;
  }, [formData]);

  async function LoadThisUserData() {
      try {
          const userId = await userService.getUserID();
          const UserData = await userService.getUserById(userId);
          return UserData.data;
        } catch (error) {
          console.error("Error fetching user ID:", error);
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await LoadThisUserData();
      // Aquí actualizas el estado con los datos recibidos
      setFormData(data);
    };
    fetchData();
  }, []); 


  const handleSubmit = useCallback(async () => {
    setSubmitAttempted(true);
    const userId = await userService.getUserID();
    if (checkRequiredFields()) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas enviar el formulario?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Enviando datos del formulario:', formData, userId);
          // Campos que deben ser numéricos
          const numericFields = [
            'age', 'height', 'weight', 'latitude', 'longitude',
            'companyLatitude', 'companyLongitude'
          ];
          // Filtrar y convertir los campos
          const filteredData = Object.fromEntries(
            Object.entries(formData)
              // eslint-disable-next-line no-unused-vars
              .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
              .map(([k, v]) =>
                numericFields.includes(k)
                  ? [k, isNaN(Number(v)) ? v : Number(v)]
                  : [k, v]
              )
          );
          userService.updateUser(userId, filteredData);
          Swal.fire('¡Enviado!', 'Formulario enviado con éxito', 'success');
        }
      });
    }
  }, [checkRequiredFields, formData]);

  // Renderizar el paso actual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1
            formData={formData}
            handleInputChange={handleInputChange}
            updateImagePreview={updateImagePreview}
            onFileSelected={onFileSelected}
            imagePreviewUrl={imagePreviewUrl}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2
            formData={formData}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <Step3
            formData={formData}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <Step4
            formData={formData}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 4:
        return (
          <Step5
            formData={formData}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 5:
        return (
          <Step6
            formData={formData}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            missingRequiredFields={missingRequiredFields}
            submitAttempted={submitAttempted}
          />
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const stepLabels = [
    'Datos personales',
    'Contacto',
    'Dirección',
    'Banco y Cripto',
    'Datos Empresariales',
    'Confirmación'
  ];

  return (
    <FormContainer elevation={3}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepLabels.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => setActiveStep(index)} style={{ cursor: 'pointer' }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 2 }}>
        {renderStepContent()}
      </Box>
    </FormContainer>
  );
};

export default MultiStepForm;