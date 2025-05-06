<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Generador de Facturas</div>
          </q-card-section>

          <q-card-section>
            <!-- Información de la empresa -->
            <div class="row q-col-gutter-md">
              <div class="col-md-6 col-sm-12">
                <q-input v-model="company.name" label="Nombre de la empresa" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="company.rut" label="RUT/NIT de la empresa" outlined dense />
              </div>
              <div class="col-12">
                <q-input v-model="company.address" label="Dirección de la empresa" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="company.phone" label="Teléfono de la empresa" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="company.email" label="Email de la empresa" outlined dense />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Información del cliente -->
            <div class="row q-col-gutter-md">
              <div class="col-md-6 col-sm-12">
                <q-input v-model="client.name" label="Nombre del cliente" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="client.rut" label="RUT/NIT del cliente" outlined dense />
              </div>
              <div class="col-12">
                <q-input v-model="client.address" label="Dirección del cliente" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="client.phone" label="Teléfono del cliente" outlined dense />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="client.email" label="Email del cliente" outlined dense />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Detalles de la factura -->
            <div class="row q-col-gutter-md">
              <div class="col-md-4 col-sm-12">
                <q-input v-model="invoice.number" label="Número de factura" outlined dense />
              </div>
              <div class="col-md-4 col-sm-12">
                <q-input v-model="invoice.date" label="Fecha" outlined dense type="date" />
              </div>
              <div class="col-md-4 col-sm-12">
                <q-input v-model="invoice.dueDate" label="Fecha de vencimiento" outlined dense type="date" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Productos -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Productos/Servicios</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-md-5 col-sm-12">
                <q-input v-model="newProduct.description" label="Descripción" outlined dense />
              </div>
              <div class="col-md-2 col-sm-12">
                <q-input v-model.number="newProduct.quantity" label="Cantidad" outlined dense type="number" min="1" />
              </div>
              <div class="col-md-2 col-sm-12">
                <q-input v-model.number="newProduct.price" label="Precio unitario" outlined dense type="number" min="0" step="0.01" />
              </div>
              <div class="col-md-2 col-sm-12">
                <q-input v-model.number="newProduct.tax" label="Impuesto (%)" outlined dense type="number" min="0" max="100" />
              </div>
              <div class="col-md-1 col-sm-12 flex flex-center">
                <q-btn icon="add" color="primary" @click="addProduct" />
              </div>
            </div>

            <q-table
              class="q-mt-md"
              :rows="products"
              :columns="productColumns"
              row-key="id"
              flat
              bordered
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn icon="delete" color="negative" flat dense @click="removeProduct(props.row.id)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Totales y acciones -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-end">
              <div class="col-md-4 col-sm-12">
                <div class="text-right q-mb-sm">
                  <strong>Subtotal:</strong> {{ formatCurrency(subtotal) }}
                </div>
                <div class="text-right q-mb-sm">
                  <strong>Impuestos:</strong> {{ formatCurrency(taxes) }}
                </div>
                <div class="text-right q-mb-sm text-h6">
                  <strong>Total:</strong> {{ formatCurrency(total) }}
                </div>
                <div class="q-mt-md">
                  <q-btn label="Generar PDF" color="primary" @click="generatePDF" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Vista previa del PDF (oculta) -->
    <div style="position: absolute; left: -9999px;">
      <div ref="invoiceTemplate" class="invoice-template">
        <div class="invoice-header">
          <h1>FACTURA</h1>
          <div class="company-info">
            <h2>{{ company.name }}</h2>
            <p>{{ company.rut }}</p>
            <p>{{ company.address }}</p>
            <p>Tel: {{ company.phone }} | Email: {{ company.email }}</p>
          </div>
        </div>

        <div class="invoice-details">
          <div class="client-info">
            <h3>Cliente:</h3>
            <p>{{ client.name }}</p>
            <p>{{ client.rut }}</p>
            <p>{{ client.address }}</p>
            <p>Tel: {{ client.phone }} | Email: {{ client.email }}</p>
          </div>
          <div class="invoice-info">
            <p><strong>Factura No:</strong> {{ invoice.number }}</p>
            <p><strong>Fecha:</strong> {{ formatDate(invoice.date) }}</p>
            <p><strong>Vencimiento:</strong> {{ formatDate(invoice.dueDate) }}</p>
          </div>
        </div>

        <table class="invoice-items">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Impuesto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.description }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ formatCurrency(product.price) }}</td>
              <td>{{ product.tax }}%</td>
              <td>{{ formatCurrency(product.quantity * product.price * (1 + product.tax/100)) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="totals-row">
            <span>Impuestos:</span>
            <span>{{ formatCurrency(taxes) }}</span>
          </div>
          <div class="totals-row total">
            <span>Total:</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <div class="invoice-footer">
          <p>Gracias por su preferencia</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  setup() {
    const company = ref({
      name: 'Mi Empresa S.A.',
      rut: '12.345.678-9',
      address: 'Av. Principal 123, Ciudad',
      phone: '+56 9 1234 5678',
      email: 'contacto@miempresa.com'
    })

    const client = ref({
      name: '',
      rut: '',
      address: '',
      phone: '',
      email: ''
    })

    const invoice = ref({
      number: 'FAC-001',
      date: new Date().toISOString().substr(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)
    })

    const newProduct = ref({
      description: '',
      quantity: 1,
      price: 0,
      tax: 19
    })

    const products = ref([])
    let productIdCounter = 0

    const productColumns = [
      { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
      { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
      { name: 'price', label: 'Precio Unitario', field: row => formatCurrency(row.price), align: 'right' },
      { name: 'tax', label: 'Impuesto (%)', field: 'tax', align: 'center' },
      { name: 'total', label: 'Total', field: row => formatCurrency(row.quantity * row.price * (1 + row.tax/100)), align: 'right' },
      { name: 'actions', label: 'Acciones', align: 'center' }
    ]

    const subtotal = computed(() => {
      return products.value.reduce((sum, product) => {
        return sum + (product.quantity * product.price)
      }, 0)
    })

    const taxes = computed(() => {
      return products.value.reduce((sum, product) => {
        return sum + (product.quantity * product.price * product.tax / 100)
      }, 0)
    })

    const total = computed(() => subtotal.value + taxes.value)

    function addProduct() {
      if (!newProduct.value.description || newProduct.value.price <= 0) {
        return
      }

      products.value.push({
        id: ++productIdCounter,
        description: newProduct.value.description,
        quantity: newProduct.value.quantity,
        price: newProduct.value.price,
        tax: newProduct.value.tax
      })

      // Reset form
      newProduct.value.description = ''
      newProduct.value.quantity = 1
      newProduct.value.price = 0
      newProduct.value.tax = 19
    }

    function removeProduct(id) {
      products.value = products.value.filter(product => product.id !== id)
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(value)
    }

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CL')
    }

    const invoiceTemplate = ref(null)

    async function generatePDF() {
      if (!invoiceTemplate.value) return

      const canvas = await html2canvas(invoiceTemplate.value)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`factura-${invoice.value.number}.pdf`)
    }

    return {
      company,
      client,
      invoice,
      newProduct,
      products,
      productColumns,
      subtotal,
      taxes,
      total,
      invoiceTemplate,
      addProduct,
      removeProduct,
      formatCurrency,
      formatDate,
      generatePDF
    }
  }
}
</script>

<style lang="scss">
.invoice-template {
  width: 210mm;
  padding: 20mm;
  font-family: Arial, sans-serif;
  color: #333;

  .invoice-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .company-info {
      text-align: right;

      h2 {
        margin: 0 0 5px 0;
        font-size: 18px;
      }

      p {
        margin: 2px 0;
        font-size: 12px;
      }
    }
  }

  .invoice-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .client-info, .invoice-info {
      width: 48%;

      h3 {
        margin: 0 0 5px 0;
        font-size: 14px;
      }

      p {
        margin: 2px 0;
        font-size: 12px;
      }
    }
  }

  .invoice-items {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
      font-size: 12px;
    }

    td {
      font-size: 11px;
    }
  }

  .invoice-totals {
    width: 300px;
    margin-left: auto;
    margin-bottom: 30px;

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #eee;

      &.total {
        font-weight: bold;
        font-size: 16px;
        border-bottom: 2px solid #333;
      }
    }
  }

  .invoice-footer {
    text-align: center;
    margin-top: 50px;
    font-size: 12px;
    color: #666;
  }
}
</style>
