import React, { useState, useCallback } from 'react';
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
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';

const genders = ['Masculino', 'Femenino', 'Otro'];
const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Other'];
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'MXN'];
const cryptoCurrencies = ['Bitcoin', 'Ethereum', 'BNB', 'XRP', 'Cardano', 'Solana'];
const cryptoNetworks = ['Bitcoin', 'Ethereum', 'Binance Smart Chain', 'Polygon', 'Solana'];

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
        <TextField fullWidth label="URL de imagen" value={formData.imageUrl} onChange={(e) => updateImagePreview(e.target.value)} variant="outlined" size="small" sx={{ mr: 2 }} />
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
        <TextField fullWidth label="Usuario" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} variant="outlined" size="small" />
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
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Dirección" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Ciudad" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Estado" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="Código postal" value={formData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Código estado" value={formData.stateCode} onChange={(e) => handleInputChange('stateCode', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Latitud" value={formData.latitude} onChange={(e) => handleInputChange('latitude', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Longitud" value={formData.longitude} onChange={(e) => handleInputChange('longitude', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="País" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Universidad" value={formData.university} onChange={(e) => handleInputChange('university', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">Siguiente</Button>
      </FormActions>
    </Box>
  );
};

// Componente para el paso 4
const Step4 = ({ formData, handleInputChange, handleBack, handleNext }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Vencimiento tarjeta" value={formData.cardExpiration} onChange={(e) => handleInputChange('cardExpiration', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Número de tarjeta" value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)} variant="outlined" size="small" />

        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Tipo de tarjeta</InputLabel>
          <Select value={formData.cardType} onChange={(e) => handleInputChange('cardType', e.target.value)} label="Tipo de tarjeta">
            {cardTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Moneda</InputLabel>
          <Select value={formData.currency} onChange={(e) => handleInputChange('currency', e.target.value)} label="Moneda">
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>{currency}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </NameFields>

      <NameFields>
        <TextField fullWidth label="IBAN" value={formData.iban} onChange={(e) => handleInputChange('iban', e.target.value)} variant="outlined" size="small" />

        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Criptomoneda</InputLabel>
          <Select value={formData.cryptocurrency} onChange={(e) => handleInputChange('cryptocurrency', e.target.value)} label="Criptomoneda">
            {cryptoCurrencies.map((crypto) => (
              <MenuItem key={crypto} value={crypto}>{crypto}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField fullWidth label="Wallet" value={formData.wallet} onChange={(e) => handleInputChange('wallet', e.target.value)} variant="outlined" size="small" />

        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Red cripto</InputLabel>
          <Select value={formData.cryptoNetwork} onChange={(e) => handleInputChange('cryptoNetwork', e.target.value)} label="Red cripto">
            {cryptoNetworks.map((network) => (
              <MenuItem key={network} value={network}>{network}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <NameFields>
        <TextField fullWidth label="Departamento" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Empresa" value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Cargo" value={formData.position} onChange={(e) => handleInputChange('position', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="Dirección empresa" value={formData.companyAddress} onChange={(e) => handleInputChange('companyAddress', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Ciudad empresa" value={formData.companyCity} onChange={(e) => handleInputChange('companyCity', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Estado empresa" value={formData.companyState} onChange={(e) => handleInputChange('companyState', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Código estado empresa" value={formData.companyStateCode} onChange={(e) => handleInputChange('companyStateCode', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="Código postal empresa" value={formData.companyPostalCode} onChange={(e) => handleInputChange('companyPostalCode', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Latitud empresa" value={formData.companyLatitude} onChange={(e) => handleInputChange('companyLatitude', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="Longitud empresa" value={formData.companyLongitude} onChange={(e) => handleInputChange('companyLongitude', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="País empresa" value={formData.companyCountry} onChange={(e) => handleInputChange('companyCountry', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <NameFields>
        <TextField fullWidth label="EIN" value={formData.ein} onChange={(e) => handleInputChange('ein', e.target.value)} variant="outlined" size="small" />
        <TextField fullWidth label="SSN" value={formData.ssn} onChange={(e) => handleInputChange('ssn', e.target.value)} variant="outlined" size="small" />
      </NameFields>

      <FormActions>
        <Button onClick={handleBack}>Atrás</Button>
        <Button color="primary" onClick={handleNext} variant="contained">Siguiente</Button>
      </FormActions>
    </Box>
  );
};

// Componente para el paso 6
const Step6 = ({ formData, handleInputChange, handleBack, handleSubmit, missingRequiredFields, submitAttempted }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Dirección*"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        error={submitAttempted && !formData.address}
        helperText={submitAttempted && !formData.address ? 'Campo obligatorio' : ''}
      />

      <TextField
        fullWidth
        label="Ciudad"
        value={formData.city}
        onChange={(e) => handleInputChange('city', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />

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
    username: '',
    ip: '',
    macAddress: '',
    userAgent: '',

    // Paso 3
    address: '',
    city: '',
    state: '',
    postalCode: '',
    stateCode: '',
    latitude: '',
    longitude: '',
    country: '',
    university: '',

    // Paso 4
    cardExpiration: '',
    cardNumber: '',
    cardType: '',
    currency: '',
    iban: '',
    cryptocurrency: '',
    wallet: '',
    cryptoNetwork: '',

    // Paso 5
    department: '',
    company: '',
    position: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyStateCode: '',
    companyPostalCode: '',
    companyLatitude: '',
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
      { field: 'address', label: 'Dirección' }
    ];

    const missing = requiredFields
      .filter(({ field }) => !formData[field])
      .map(({ label }) => label);

    setMissingRequiredFields(missing);
    return missing.length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    setSubmitAttempted(true);
    if (checkRequiredFields()) {
      // Aquí iría la lógica para enviar el formulario
      console.log('Formulario enviado:', formData);
      alert('Formulario enviado con éxito');
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