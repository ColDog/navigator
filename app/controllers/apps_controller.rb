class AppsController < ApplicationController
  include AppHelper

  def index
    @apps = App.all
  end

  def new
    @app = App.new
    @manifest = {}
  end

  def edit
    @app = App.find_by!(uid: params[:id])
    @manifest = get_app_manifest(params[:id])
  end

  def logs
    @app = App.find_by!(uid: params[:app_id])
  end

  def show
    @app = App.find_by!(uid: params[:id])
  end

  def create
    create_app_from_manifest(manifest_params)
    flash[:info] = 'Application created'
    redirect_to apps_path
  rescue ValidationError => e
    flash.now[:error] = e.errors
    render :new, status: 400
  end

  def update
    @manifest = manifest_params
    @app = App.find_by!(uid: params[:id])
    create_app_from_manifest(manifest_params)
    flash[:info] = 'Application updated'
    redirect_to edit_app_path(@app.uid)
  rescue ValidationError => e
    flash.now[:error] = e.errors
    render :edit, status: 400
  end

  def destroy
    Apps::DeleteCommand.execute(app_uid: params[:id])
    flash[:info] = 'Application removed'
    redirect_to apps_path
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to apps_path, status: 400
  end

  private

  def manifest_params
    JSON.parse(params.require(:app).permit(:manifest)[:manifest]).deep_symbolize_keys!
  end

  def app_params
    params.require(:app).permit(:name)
  end

end
